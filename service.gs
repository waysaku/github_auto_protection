const validate = json => {
    if (!json) {
        return false;
    }
    if (json.ref_type !== 'branch') {
        Logger.log(`No operations for ref_type = ${json.ref_type}`);
        return false;
    }
    if (json.ref !== json.repository.default_branch) {
        Logger.log(`No operation for ref = ${json.ref}`);
        return false;
    }
    if (!json.repository.name || !json.repository.owner.login || !json.master_branch) {
        Logger.log(`parameters are invalid.`);
        Logger.log(`name = ${json.repository.name}`)
        Logger.log(`login = ${json.repository.owner.login}`)
        Logger.log(`master_branch = ${json.master_branch}`)
        return false;
    }
    return true;
}

const fetch = (method, headers, payload, url) => {
    const options = {
        "headers": headers,
        "method": method,
        "payload": JSON.stringify(payload)
    };
    Logger.log(options);
    Logger.log(url);
    UrlFetchApp.fetch(url, options);
}

const applyProtection = json => {
    const repoName = json.repository.name;
    const owner = json.repository.owner.login;
    const branch = json.master_branch;

    const headers = {
        "Accept": "application/vnd.github.luke-cage-preview+json",
        "Authorization": `token ${github_token}`
    };
    const payload = {
        owner: owner,
        repo: repoName,
        branch: branch,
        required_status_checks: {
            strict: true,
            contexts: ["contexts"]
        },
        enforce_admins: true,
        required_pull_request_reviews: {
            require_code_owner_reviews: true,
            required_approving_review_count: 2
        },
        restrictions: {
            users: ["users"],
            teams: ["teams"],
            apps: ["apps"]
        }
    }
    const url = `https://api.github.com/repos/${owner}/${repoName}/branches/${branch}/protection`;
    fetch("put", headers, payload, url)
}

const createIssue = json => {
    const repoName = json.repository.name;
    const owner = json.repository.owner.login;

    const headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `token ${github_token}`
    };
    const payload = {
        title: "Organization of strobolights branch protection has applied!",
        body: "@waysaku strobolights administrator has found a new repository. Organization branch protection has applied automatically!"
    }
    const url = `https://api.github.com/repos/${owner}/${repoName}/issues`;
    fetch("post", headers, payload, url)
}
