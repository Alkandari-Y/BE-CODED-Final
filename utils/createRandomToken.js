exports.createRandomToken = () => {
    const randomNum = String(Math.floor(Math.random() * 10000));
    console.log(randomNum)
    return randomNum;
}