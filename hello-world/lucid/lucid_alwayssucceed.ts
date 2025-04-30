import { Blockfrost, Lucid, Crypto,fromText,Data,Addresses } from "https://deno.land/x/lucid/mod.ts";

// Provider selection
// There are multiple builtin providers you can choose from in Lucid.

// Blockfrost
const lucid =await new Lucid({
  provider: new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    "preview7xQDwsuz2srNhCa5SRqmsUHMhBpZuzVc"
  ),
});


const seed = "giraffe vicious rival alien play solve pilot odor insane admit purchase can act poverty hybrid dry muscle lunch leg tunnel quiz early argue crumble"
lucid.selectWalletFromSeed(seed, { addressType: "Base", index: 0});

//scripts alwaysSucceed 

const alwaysSucceed_scripts = lucid.newScript({
    type: "PlutusV3",
    script: "588501010029800aba2aba1aab9faab9eaab9dab9a48888896600264653001300700198039804000cc01c0092225980099b8748008c01cdd500144c8cc896600266e1d2000300a375400d132325980098080014528c5900e1bae300e001300b375400d16402460160026016601800260106ea800a2c8030600e00260066ea801e29344d9590011",
  });
  
  const alwaysSucceedAddress = alwaysSucceed_scripts.toAddress();
  console.log(`Always succeed address: ${alwaysSucceedAddress}`);


const Datum = () => Data.void();
//dinh nghia cau truc redeemer
const RedeemerSchema = Data.Object({
	msg: Data.Bytes,
});

//tao 1 redeemer voi gia tri cu the
const Redeemer = () => Data.to({ msg: fromText("Hello!") }, RedeemerSchema);
const lovelace_lock = 500_000_093n
console.log(`lovelace lock: ${lovelace_lock}`);

//lockutxo===
export async function lockUtxo(lovelace: bigint): Promise<string> {
    const tx = await lucid
      .newTx()
      .payToContract(alwaysSucceedAddress, { Inline: Datum() }, { lovelace: lovelace })
      .commit();
  
    const signedTx = await tx.sign().commit();
    console.log(signedTx);
  
    const txHash = await signedTx.submit();
    return txHash;
}
// Mở Khóa UTxO và gửi đến một địa chỉ
export async function unlockUtxo(lovelace: bigint): Promise<string> {
  const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) =>
    utxo.assets.lovelace == lovelace && utxo.datum === Datum() && !utxo.scriptRef
  );
  console.log(utxo);
  if (!utxo) throw new Error("Không tìm thấy UTxO với số lovelace yêu cầu");
  const receiverAddress = "addr_test1qzldl9u0j6ap7mdugtdcre43f8dfrnv7uqd3a6furpyuzw3z70zawv8g3tyg7uh833x50geeul2vpyujyzac0d6dmgcsyu5akw"; // Sử dụng lại biến BTC hoặc đặt tên rõ ràng hơn
  const _93_ = 93_000_000n;
  const tx = await lucid
    .newTx()
    .payTo(receiverAddress, { lovelace: _93_ }) // Thêm đầu ra để gửi ADA
    .collectFrom([utxo], Redeemer())
    .attachScript(alwaysSucceed_scripts)
    .validTo(Date.now() + 2000000)
 
    .commit();

  const signedTx = await tx.sign().commit();
  const txHash = await signedTx.submit();
  return txHash;
}


//==main===
async function main(){
	try{
		// const txHash = await lockUtxo(lovelace_lock);
		// console.log(`transaction hash: ${txHash}`);

// Gọi hàm redeemUtxo để mở khóa UTXO
const redeemTxHash = await unlockUtxo(lovelace_lock);
console.log(`Transaction hash: ${redeemTxHash}`);

	} catch (error){
		console.error("Error locking UTxO:", error);
	}
}
main();

//deno run --allow-all lucid/lucid_alwayssucceed.ts