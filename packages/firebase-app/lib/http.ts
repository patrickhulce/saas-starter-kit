import * as functions from 'firebase-functions'
import './conf' // tslint:disable-line
import {app} from '../../api/lib/app'

export const api = functions.https.onRequest(app)
