import * as functions from 'firebase-functions'
import {app} from '../../api/lib/app'

export const api = functions.https.onRequest(app)
