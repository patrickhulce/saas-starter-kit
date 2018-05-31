import * as React from 'react'

export interface IFormData {
  [key: string]: any
}

export class Form<TState extends object> extends React.Component<{}, Partial<TState>> {
  public constructor(props: {}) {
    super(props)
    this.state = {} as Partial<TState> // tslint:disable-line
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public handleSubmit(evt: any): void {
    evt.preventDefault()
    const data: IFormData = {}
    for (const [prop, val] of new FormData(evt.target).entries()) {
      data[prop] = val
    }

    this._handleSubmit(data)
  }

  public _handleSubmit(data: IFormData): void {
    throw new Error('Unimplemented')
  }
}
