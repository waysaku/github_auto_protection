const github_token = "SET YOUR GITHUB TOKEN";

const doPost = e => {
    Logger.log("automated protection process started");

    const json = JSON.parse(e.postData.getDataAsString());
    if (!validate(json)) {
        return;
    }
    applyProtection(json);
    createIssue(json);

    Logger.log("automated protection process completed");
}
