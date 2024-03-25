import { exec } from 'child_process';
import { expect } from 'chai';

function check(done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}

describe('gulp tasks', () => {
  it('should build project', (done) => {
    exec('gulp testBuild', function (error, stdout, stderr) {
      expect(error).to.be.null;
      expect(stderr).to.be.empty;
      expect(stdout).contains("Finished 'testBuild'");
      done();
    });
  }).timeout(10000);
});
