import * as React from 'react'

import {testIds} from '../../utils'

import * as styles from './message-bar.scss'

export enum MessageBarStyle {
  Success = 'success',
  Error = 'error',
}

export interface IMessageBarProps {
  style?: MessageBarStyle
  message?: string
}

const styleMap = {
  [MessageBarStyle.Success]: styles.successBar,
  [MessageBarStyle.Error]: styles.errorBar,
}

export class MessageBar extends React.Component<IMessageBarProps> {
  public render(): JSX.Element | null {
    const {message, style = MessageBarStyle.Success} = this.props
    if (!message) return null

    return (
      <div className={styleMap[style]} data-testid={testIds.messageBar}>
        {message}
      </div>
    )
  }
}
