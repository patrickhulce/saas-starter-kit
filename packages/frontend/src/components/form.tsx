import * as React from 'react'

export interface IFormData {
  [key: string]: any
}

export class Form<TProps = {}, TState = {}> extends React.Component<TProps, TState> {
  public constructor(props: TProps) {
    super(props)
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

  protected _handleSubmit(data: IFormData): void {
    throw new Error('Unimplemented')
  }
}
