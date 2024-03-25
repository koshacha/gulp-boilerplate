import { exec } from 'child_process';
import { expect } from 'chai';
import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

describe('gulp tasks', () => {
  it('should build project', (done) => {
    exec('gulp testBuild', function (error, stdout, stderr) {
      expect(error).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).contains("Finished 'testBuild'");
      done();
    });
  }).timeout(10000);

  after(() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const tempDir = join(__dirname, 'test-build');
    fs.removeSync(tempDir);
  });
});
