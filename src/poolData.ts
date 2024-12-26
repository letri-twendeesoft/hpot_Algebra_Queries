const END_POINT = 'https://api.goldsky.com/api/public/project_cm53bacbgi3xv01uzdjeied3e/subgraphs/algebra/1.0.3/gn'
import axios from "axios"
export const poolDaysData = async () => {


    const query = {
        query: `query PoolDaysData {
            poolDayDatas(where: {pool: "0x15c532b7678d8d807c93fa825e2cbc29e9901a1b"}) {
                date
                id
                feesUSD
                aprPercentage
                volumeUSD
                txCount
                tvlUSD
            }
        }`,
    }

    const { data } = await axios.post(END_POINT, query)

    const poolDayDatas = data?.data?.poolDayDatas || [];
    const formatedData = [];
    for (let i = 0; i < poolDayDatas.length; i++) {
        const prevId = i === 0 ? 0 : i - 1
        const { feesUSD: fee, date: timestamp, txCount, id } = poolDayDatas[i]
        const { feesUSD: prevFee } = poolDayDatas[prevId]
        const feesUSD = Number(fee)
        const date = new Date(timestamp * 1000).toDateString()
        const change = Number(prevFee) === 0 ? 100 : (fee - prevFee) / prevFee * 100

        formatedData.push({ id, feesUSD, date, txCount, change: `${change.toFixed(2)}%` })

    }
    console.log(formatedData)
}

export const poolWeekDatas = async () => {


    const query = {
        query: `query PoolDaysData {
            poolDayDatas(where: {pool: "0x15c532b7678d8d807c93fa825e2cbc29e9901a1b"}) {
                date
                id
                feesUSD
                aprPercentage
                volumeUSD
                txCount
                tvlUSD
            }
        }`,
    }

    const { data } = await axios.post(END_POINT, query)

    const poolDayDatas = data?.data?.poolDayDatas || [];
    const formatedData = [];
    for (let i = 0; i < poolDayDatas.length; i++) {
        const prevId = i === 0 ? 0 : i - 1
        const { feesUSD: fee, date: timestamp, txCount, id } = poolDayDatas[i]
        const { feesUSD: prevFee } = poolDayDatas[prevId]
        const feesUSD = Number(fee)
        const date = new Date(timestamp * 1000).toDateString()
        const change = Number(prevFee) === 0 ? 100 : (fee - prevFee) / prevFee * 100

        formatedData.push({ id, feesUSD, date, txCount, change: `${change.toFixed(2)}%` })

    }
    console.log(formatedData)
}