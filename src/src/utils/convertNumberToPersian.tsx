export const convertEnglishNumberToPersian = (number: number) => {
    const persianNumberDict = {
        0: "۰",
        1: "۱",
        2: "۲",
        3: "۳",
        4: "۴",
        5: "۵",
        6: "۶",
        7: "۷",
        8: "۸",
        9: "۹"
    }
    const convertedNumberToList = number.toString().split("");
    let persianNumber = "";
    for (let i = 0; i < convertedNumberToList.length; i++) {
        persianNumber += persianNumberDict[convertedNumberToList[i]]
    }
    return persianNumber
}