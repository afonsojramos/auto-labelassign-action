import * as core from '@actions/core';
import { getIssueContent } from './issues';
import { checkKeywords } from './checkKeywords';
import { setIssueContents } from './issueContents';

async function run() {
	try {
		core.setOutput('labeled', false.toString());
		core.setOutput('assigned', false.toString());
		const titleOrBody: string = core.getInput('title-or-body');
		const token = core.getInput('github-token');
		const content = await getIssueContent(token, titleOrBody);
		const parameters: { keywords: string[]; labels: string[]; assignees: string[] }[] = JSON.parse(
			core.getInput('parameters', { required: true })
		);

		if (!parameters) {
			core.setFailed(
				`parameters input not found. Make sure your ".yml" file contains a "parameters" JSON array like this:
        parameters: '[ {"keywords": ["bug", "error"], "labels": ["BUG"], "assignees": ["username"]}, {"keywords": ["help", "guidance"], "labels": ["help-wanted"], "assignees": ["username"]}]'`
			);
		}

		const matchingKeywords = checkKeywords(parameters, content);

		if (!matchingKeywords) {
			core.setOutput('Keywords not found in this issue.', true.toString());
		} else {
			setIssueContents(token, matchingKeywords);
			core.setOutput('Run complete', true.toString());
		}
	} catch (error: any) {
		core.setFailed(error.message);
	}
}

run();
