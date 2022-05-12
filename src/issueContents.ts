import { getOctokit } from '@actions/github';
import { getRepo, getIssueNumber } from './github';

export const setIssueContents = async (
	token: string,
	matchingKeywords: { keywords: string[]; labels: string[]; assignees: string[] }[]
) => {
	const octokit = getOctokit(token);
	const issue_number = getIssueNumber();

	if (!issue_number) {
		throw new Error('No Issue Provided');
	}

	let assignees: string[] = [];
	let labels: string[] = [];

	matchingKeywords.forEach(keyword => {
		keyword.assignees.forEach(assignee => {
			assignees.push(assignee);
		});
		keyword.labels.forEach(label => {
			labels.push(label);
		});
	});

	if (assignees.length > 0)
		await octokit.rest.issues.addAssignees({
			...getRepo(),
			issue_number,
			assignees,
		});

	if (labels.length > 0)
		await octokit.rest.issues.addLabels({
			...getRepo(),
			issue_number,
			labels,
		});
};
