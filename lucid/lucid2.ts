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
//======lucid 2====
//=====tao script======
async function createMintingscripts(slot_in: bigint) {
	const { payment } = Addresses.inspect(
		await lucid.wallet.address(),
	);

	const mintingPolicy = lucid.newScript(
		{
			type: "All",
			scripts: [
				{ type: "Sig", keyHash: payment.hash },
				{
				  type: "Before",
				  slot: slot_in				},
			],
		},
	);
	return mintingPolicy;
}

//===minttoken====
async function mintToken(policyId: string, tokenName: string, amount: bigint, slot_in: bigint) {
	const unit = policyId + fromText("tokenName");
//======tao metadata============
	const metadata= {
		[policyId]: {
			[tokenName]: {
				"description": "This is Token minted by LUCID",
				"name": `${tokenName}`,
				"id":1,
				"image": "ipfs://QmSWjdZiG5qjsJNrQgREbEcvXgH61BgvqC5tExT5p756Ch"
			}
		}
	};
	console.log(metadata);
    // Deno.exit(0); // thoat chuong trinh
	
	const tx = await lucid.newTx()
		.mint({ [unit]: amount })
		.validTo(Date.now() + 200000)
		.attachScript(await createMintingscripts(slot_in))
		.attachMetadata(721,metadata)
		.commit();
	return tx;
}
//====burn token=====
async function burnToken(policyId: string, tokenName: string, amount: bigint, slot_in: bigint) {
	const unit = policyId + fromText("tokenName");
	const tx = await lucid.newTx()
		.mint({ [unit]: amount })
		.validTo(Date.now() + 200000)
		.attachScipt(await createMintingscripts(slot_in))
		.commit();
	return tx;
}


//=====main=======
const slot_in = BigInt(79742642)  //BigInt(lucid.utils.unixTimeToSlots(Date.now() +1000000000 ));
console.log(`slot: ${slot_in}`);


const mintingScripts = await createMintingscripts(slot_in);

const policyId = mintingScripts.toHash();
console.log(`ma chinh sach minting la: ${policyId}`);

const tx = await mintToken(policyId, "mduc",10n,slot_in);

let signedTx = await tx.sign().commit();
let txhash = await signedTx.submit();
console.log(`Bạn có thể kiểm tra giang dịch với txhash ${txhash}`);

Deno.exit(0); // thoat chuong trinh

//deno run --allow-all lucid2.ts