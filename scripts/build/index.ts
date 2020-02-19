/**
 * This file takes packages in `src` and compiles them into single files (two if using a post step) and puts them in the `dist` folder along side the required `action.yml`.
 */

import { reportError } from '../utils/reportError';
import { buildPrepareScript } from './prepare';
import { buildTarget } from './target';

Promise.all([
  buildPrepareScript(),
  buildTarget('checkout'),
  // buildTarget('build'),
  // buildTarget('test'),
  buildTarget('prepare'),
  buildTarget('deploy'),
]).catch(reportError);
