import path from 'path'

const envFilePath = path.resolve(__dirname, '../../env_variables/dev/babyTracker/.env.babyTracker')

require('dotenv').config({ path: envFilePath })

import { serverStart } from './server'
serverStart()
