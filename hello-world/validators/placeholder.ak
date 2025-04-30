
use cardano/transaction.{Transaction, OutputReference}
use aiken/primitive/string

pub type Redeemer {
  msg: ByteArray,
}

validator alwayssuccess {


  spend(
    _datum: Option<Data>, 
    redeemer: Redeemer, 
    _utxo: OutputReference, 
    _self: Transaction) {
    trace @"redeemer": string.from_bytearray(redeemer.msg)
    let a = True
    a?
  }

  else(_) {
    fail
  }

  

  // // If needs be, remove any of unneeded handlers above, and use:
  //
  // else(_ctx: ScriptContext) {
  //   todo @"fallback logic if none of the other purposes match"
  // }
  //
  // // You will also need an additional import:
  // //
  // // use cardano/script_context.{ScriptContext}
}
