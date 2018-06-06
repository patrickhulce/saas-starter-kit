import * as styles from './loading-bar.scss'
import * as React from 'react'

export interface ILoadingBarProps {
  isLoading?: boolean
}

export class LoadingBar extends React.Component<ILoadingBarProps> {
  public render(): JSX.Element | null {
    if (!this.props.isLoading) return null
    return (
      <div className={styles.loadingBar} data-testid="loading-bar">
        <div className={styles.loadingBarAnimatedChunk} />
      </div>
    )
  }
}
