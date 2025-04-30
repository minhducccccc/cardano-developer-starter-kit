
use cardano/transaction.{Transaction, OutputReference}
use aiken/primitive/string

pub type Datum {
    value: ByteArray,
}

pub type Redeemer {
  value: ByteArray,
}

validator compare_datum_redeemer {


  spend(
    datum: Option<Datum>, 
    redeemer: Redeemer, 
    _utxo: OutputReference, 
    _self: Transaction) {
    expect Some(datum_input) = datum
    let d: Datum = datum_input
    trace @"redeemer": string.from_bytearray(redeemer.value)
    let a = d.value == redeemer.value
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
