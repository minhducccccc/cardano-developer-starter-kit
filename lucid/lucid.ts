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

//get address
const address = await lucid.wallet.address();   
console.log (`D/c vi gui: ${address}`) //hien dia chi vi

//----query utxo----
const utxos = await lucid.wallet.getUtxos();
const utxo=utxos[1];
// console.log(utxo)
const assets=utxo.assets;//lay thong tin assets tu utxo
//------hien thi toan bo tai san cua chung
// for(const assetname in assets) {
// 	console.log(`Assetname: ${assetname},Value: ${assets[assetname]}`);
// }

//---datum---
// const [scriptUtxo] = await lucid.utxosAt("addr_test1wrv8xtfuwyfsq2zhur8es0aw4pq6uz73um8a4507dj6wkqc4yccnh");
// console.log(scriptUtxo)

//-tao giao dich--

// const tx=await lucid.newTx()

// 	.payTo("addr-test1", {lovelace: 300n })//co the gom nhieu payTo
// 	.commit();

// const signedTx = await tx.sign().commit();
// console.log(`signedTx: ${signedTx}`)
 
// const txhash = await signedTx.submit();

//----giao dich voi metadata---
const toAddress = "addr_test1qzlxd23dc6ez5ff44gkm8etuluumr24yksx3rrue22hxs8h3hcxhv6dxnder6teqkx95r6n6px3xsyydqpgkpl3p20wqm4rd9h";
const amount = 1n;
// const metadata = { msg: ["hello C2VN_BK03. this is metadata 674"]};

// const tx = await lucid.newTx()
// .payTo(toAddress, { lovelace: amount })
// .attachMetadata(674,metadata)
// .commit();

// const signedTx = await tx.sign().commit();

// const txhash = await signedTx.submit();

// console.log(` ma giao dich la: ${txhash}`)

//---send tokens----
// async function createSendNativeTokens(toAddress: string, policyId: string, assetName: string, amount: bigint) {
// 	const tx = await lucid.newTx()
// 		.payTo(toAddress, { [policyId + fromText(assetName)]: amount })
// 		.commit();
// 	return tx;
// }


// const tx = await createSendNativeTokens(toAddress, "24a8c18202c6f71b2d3276672fd87216e8d3d8f6fb349a76912164df","leminhduc_93",1n);
// let signedTx = await tx.sign().commit();
// let txhash = await signedTx.submit();
// console.log(` ma giao dich la: ${txhash}`);


//----datum----
async function createSendAdaWithDatum(toAddress: string, datum: any, amount: bigint) {
	const tx = await lucid.newTx()
		.payToWithData(toAddress, datum, { lovelace: amount })
		.commit();
	return tx;
}

const VestingSchema = Data.Object({
	lock_until: Data.Integer(),
	beneficiary: Data.Bytes(),
});
const deadlineDate: Date = new Date("2026-03-20T20:00:00Z")
const deadlinePosIx = BigInt(deadlineDate.getTime());

const {payment} = Addresses.inspect(
"addr_test1qzlxd23dc6ez5ff44gkm8etuluumr24yksx3rrue22hxs8h3hcxhv6dxnder6teqkx95r6n6px3xsyydqpgkpl3p20wqm4rd9h");

const d = {
	lock_until: deadlinePosIx,
	beneficiary: payment?.hash,
};

const datum = await Data.to<VestingSchema>(d, VestingSchema);
console.log(datum);
Deno.exit(0); // thoat chuong trinh
const tx = await createSendAdaWithDatum(toAddress,datum, amount);
console.log(`${tx}`);
Deno.exit(0); // thoat chuong trinh
let signedTx = await tx.sign().commit();
let txhash = await signedTx.submit();
console.log(` ma giao dich la: ${txhash}`);








//deno run --allow-all lucid.ts