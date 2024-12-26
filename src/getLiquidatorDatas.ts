// const API_KEY = 'cm54u5mvuza7o01vr5k96cb0t'
const END_POINT = 'https://api.goldsky.com/api/public/project_cm53bacbgi3xv01uzdjeied3e/subgraphs/algebra/1.0.3/gn'
import axios from "axios"

export const getLiquidatorDatas = async () => {

    const query = {
        query: `query MyQuery {
            liquidatorDatas(where: {account: "0x00f978ff7b5f9e40f8cc6e01430d3aa2a2dc94a3"}) {
                id
                totalLiquidityUsd
                pool {
                    collectedFeesUSD
                    totalValueLockedUSD
                    feesUSD
                    poolHourData {
                        feesUSD
                        id
                        tvlUSD
                        txCount
                        periodStartUnix
                    }
                    poolDayData {
                        feesUSD
                        id
                        txCount
                        tvlUSD
                        date
                    }
                }
            }   
        }`,
        operationName: "MyQuery"
    }

    const { data } = await axios.post(END_POINT, query)

    const liquidatorDatas = data.data.liquidatorDatas
    console.log(liquidatorDatas)
    const userPoolsProfit = []

    for (let i = 0; i < liquidatorDatas.length; i++) {

        const { id, totalLiquidityUsd, pool: { totalValueLockedUSD, feesUSD, poolDayData, poolHourData } } = liquidatorDatas[i]
        const [account, poolAddress] = id.split('#')
        const depositedUsd = Number(totalLiquidityUsd)
        const collectedFeesUSD = Number(feesUSD)
        const totalValueUSD = Number(totalValueLockedUSD)
        const profit = (depositedUsd / totalValueUSD) * collectedFeesUSD

        const pool = {
            address: poolAddress,
            poolDaysData: [] as any[],
            poolHoursData: [] as any[],
        }


        for (let j = 0; j < poolHourData.length; j++) {
            const prevId = j === 0 ? 0 : j - 1
            const { feesUSD: fee, periodStartUnix: timestamp, txCount } = poolHourData[j]
            const { feesUSD: prevFee } = poolHourData[prevId]
            const feesUSD = Number(fee)
            const date = new Date(timestamp * 1000).toDateString()
            const change = Number(prevFee) === 0 ? 100 : (fee - prevFee) / prevFee * 100

            pool.poolHoursData.push({ feesUSD, date, txCount, change: `${change.toFixed(2)}%` })
        }

        for (let j = 0; j < poolDayData.length; j++) {
            const prevId = j === 0 ? 0 : j - 1
            const { feesUSD: fee, date: timestamp, txCount } = poolDayData[j]
            const { feesUSD: prevFee } = poolDayData[prevId]
            const feesUSD = Number(fee)
            const date = new Date(timestamp * 1000).toDateString()
            const change = Number(prevFee) === 0 ? 100 : (fee - prevFee) / prevFee * 100

            pool.poolDaysData.push({ feesUSD, date, txCount, change: `${change.toFixed(2)}%` })
        }

        userPoolsProfit.push({ account, pool, depositedUsd, collectedFeesUSD, totalValueUSD, profit })
    }

    console.log(userPoolsProfit[0].pool)
}
