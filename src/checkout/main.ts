// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';

const branch = core.getInput('branch', { required: true });
