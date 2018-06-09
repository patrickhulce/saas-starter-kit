import * as React from 'react'

import {testIds} from '../../utils'

import * as styles from './loading-bar.scss'

export interface ILoadingBarProps {
  isLoading?: boolean
}

export class LoadingBar extends React.Component<ILoadingBarProps> {
  public render(): JSX.Element | null {
    if (!this.props.isLoading) return null
    return (
      <div className={styles.loadingBar} data-testid={testIds.loadingBar}>
        <div className={styles.loadingBarAnimatedChunk} />
      </div>
    )
  }
}
