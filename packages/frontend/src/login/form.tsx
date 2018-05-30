import * as React from 'react'

export class Form extends React.Component<{}, any> {
  public constructor(props: {}) {
    super(props)
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public handleSubmit(evt: any): void {
    evt.preventDefault()
    const data: any = {}
    for (const [prop, val] of new FormData(evt.target).entries()) {
      data[prop] = val
    }

    this._handleSubmit(data)
  }

  public _handleSubmit(data: any): void {
    throw new Error('Unimplemented')
  }
}
