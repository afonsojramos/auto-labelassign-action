import * as github from '@actions/github';

export const getIssueNumber = (): number => {
	return github.context.payload.issue?.number || github.context.payload.issue?.number || 0;
};

export const getRepo = (): { owner: string; repo: string } => {
	return github.context.repo;
};
