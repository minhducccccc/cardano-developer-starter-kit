import { Blockfrost, Lucid, Crypto, fromText, Data, Addresses } from "https://deno.land/x/lucid/mod.ts";
 
 // Provider selection
 // There are multiple builtin providers you can choose from in Lucid.
 
 // Blockfrost
 const lucid = new Lucid({
   provider: new Blockfrost(
     "https://cardano-preview.blockfrost.io/api/v0",
     "preview7xQDwsuz2srNhCa5SRqmsUHMhBpZuzVc"
   ),
 });
 
 
 
 
 console.log(lucid);
 const seed = "giraffe vicious rival alien play solve pilot odor insane admit purchase can act poverty hybrid dry muscle lunch leg tunnel quiz early argue crumble"
 lucid.selectWalletFromSeed(seed);
 
 console.log(lucid.wallet);
 //scripts : alwaysSucceed
 const alwaysSucceed_scripts = lucid.newScript({
   type: "PlutusV3",
   script: "58af01010029800aba2aba1aab9faab9eaab9dab9a48888896600264653001300700198039804000cc01c0092225980099b8748008c01cdd500144c8cc896600266e1d2000300a375400d13232598009808001456600266e1d2000300c375400713371e6eb8c03cc034dd5180798069baa003375c601e601a6ea80222c805a2c8070dd7180700098059baa0068b2012300b001300b300c0013008375400516401830070013003375400f149a26cac80081"
 });
 const alwaysSucceedAddress = alwaysSucceed_scripts.toAddress();
 console.log(`Always succeed address: ${alwaysSucceedAddress}`);
 
 

 // Định nghĩa cấu trúc Datum
 const DatumSchema = Data.Object({
     msg: Data.Bytes, 
 });
 
 // Định nghĩa cấu trúc Redeemer
 const RedeemerSchema = Data.Object({
     msg: Data.Bytes, // msg là một ByteArray
 });
 
 const Datum = () => Data.to({ msg: fromText("le minh duc 93") }, DatumSchema); // "48656c6c6f20576f726c64" là chuỗi "Hello World" được mã hóa dưới dạng hex
 console.log("Datum: ", Datum());
 // Tạo một Redeemer với giá trị cụ thể
 const Redeemer = () => Data.to({ msg: fromText("le minh duc 93") }, RedeemerSchema); // "48656c6c6f20576f726c64" là chuỗi "Hello World" được mã hóa dưới dạng hex
 const lovelace_lock=50_000_000n;
 
 
 console.log(`Lovelace lock: ${lovelace_lock}`);
 
 // Lock UTxO
 
 
 export async function lockUtxo(lovelace: bigint, unit: string, amount: bigint): Promise<string> {
   const tx = await lucid
     .newTx()
     .payToContract(alwaysSucceedAddress, { Inline: Datum() }, { lovelace, [unit] : amount })
     .commit();
 
   const signedTx = await tx.sign().commit();
   console.log(signedTx);  
   
 
   const txHash = await signedTx.submit();
 
   return txHash;
 }
 
 
 
 // Mở khóa UTxO
 export async function unlockUtxo(unit: string, amount: bigint, redeemer: RedeemerSchema): Promise<string> {
     const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) =>
       !utxo.scriptRef && utxo.datum === redeemer && 
    utxo.assets[unit] === amount // && utxo.assets.lovelace == lovelace
     );
     console.log(`redeemer: ${redeemer}`);
     console.log(`UTxO unlock: ${utxo}`);
 
 
     console.log(utxo);
     if (!utxo) throw new Error("ko tim dc utxo co lovelace can tim");
 
     const address = await lucid.wallet.address();
     console.log(" address:", address);
     
   
     const tx = await lucid
         .newTx()
         .collectFrom([utxo], Redeemer())
         .attachScript(alwaysSucceed_scripts)
         .commit();
 
     const signedTx = await tx.sign().commit();
 
     const txHash = await signedTx.submit();
 
     return txHash;
 }
 
 
 
 
 async function main() {
   try {
     const policyId = "24a8c18202c6f71b2d3276672fd87216e8d3d8f6fb349a76912164df"; 
     const tokenName = "leminhduc_93";  
     const unit = policyId + fromText(tokenName); 
     const amount = 93n; 
     
     console.log(`Unit: ${unit}`);
     console.log(`Amount: ${amount}`);
 
    //  const lockTxHash = await lockUtxo(lovelace_lock, unit, amount);
    //  console.log(`Lock Tx Hash: ${lockTxHash}`);
 
     const redeemTxHash = await unlockUtxo(unit, amount, Redeemer());
     console.log(`Transaction hash: ${redeemTxHash}`);
     
   } catch (error) {
     console.error("Error locking UTXO:", error);
   }
 }
     
     main();

     //deno run --allow-all lucid/lucid_last.ts