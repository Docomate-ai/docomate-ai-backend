import { BadRequestException } from '@nestjs/common';

export function getUsernameRepository(repoUrl: string) {
  const match = repoUrl.match(
    /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)(?:\/|$)/,
  );
  if (!match) {
    throw new BadRequestException('Invalid GitHub repository URL.');
  }
  const [_, username, repository] = match;
  return [username, repository];
}
