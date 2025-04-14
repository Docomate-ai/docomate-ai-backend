// validate-repo.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ValidateRepoPipe implements PipeTransform {
  async transform(value: any) {
    const inputUrl = value.repoUrl;

    // Ensure it's a valid GitHub URL
    const githubDomainRegex =
      /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)(\/.*)?$/;
    const match = inputUrl.match(githubDomainRegex);

    if (!match) {
      throw new BadRequestException('Invalid GitHub URL format');
    }

    const [, owner, repo] = match;

    try {
      // Check if the repo exists using GitHub API
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const res = await axios.get(apiUrl);

      if (res.status !== 200) {
        throw new BadRequestException('GitHub repository does not exist');
      }

      // Update the body to have clean repo URL
      return {
        ...value,
        repoUrl: `https://github.com/${owner}/${repo}`,
      };
    } catch (err) {
      throw new BadRequestException('GitHub repository not found or invalid');
    }
  }
}
