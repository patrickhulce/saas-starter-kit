import * as React from 'react'

import {testIds} from '../../utils'

import * as styles from './error-bar.scss'

export interface IErrorBarProps {
  message?: string
}

export class ErrorBar extends React.Component<IErrorBarProps> {
  public render(): JSX.Element | null {
    const {message} = this.props
    if (!message) return null

    return (
      <div className={styles.errorBar} data-testid={testIds.errorBar}>
        {message}
      </div>
    )
  }
}
