import { ServerRespond } from './DataStreamer';
import { TableData } from '@finos/perspective';
export interface Row {
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: boolean,
  timestamp: Date,
  price_abc: number,
  price_def: number,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): TableData {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upper_bound = 1.1;
    const lower_bound = 0.99;
    const trigger_alert = ratio > upper_bound || ratio < lower_bound;

    return {
      ratio:ratio.toString(),
      upper_bound:upper_bound.toString(),
      lower_bound:lower_bound.toString(),
      trigger_alert:trigger_alert.toString(),
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp
        ? serverResponds[0].timestamp.toString()
        : serverResponds[1].timestamp.toString(),
      price_abc: priceABC.toString(),
      price_def: priceDEF.toString(),
    };
  }
}
