import { getOctokit } from '@actions/github';
import { getRepo, getIssueNumber } from './github';

export const getIssueContent = async (token: string, titleOrBody: string): Promise<string> => {
	const octokit = getOctokit(token);
	const issue_number = getIssueNumber();

	if (!issue_number) {
		throw new Error('No Issue Provided');
	}

	const { data } = await octokit.rest.issues.get({
		...getRepo(),
		issue_number,
	});

	if (titleOrBody === 'title') {
		return `${data.title}`;
	} else if (titleOrBody === 'body') {
		return `${data.body}`;
	} else {
		return `${data.title} ${data.body}`;
	}
};
