import { getLiquidatorDatas } from "./getLiquidatorDatas.js";
import { poolDaysData } from "./poolData.js";

const main = async () => {
    // await getLiquidatorDatas();
    await poolDaysData()
}

main();