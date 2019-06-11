import React from 'react'
import { shallow } from 'enzyme'

import TopBar from './TopBar'

describe('components/TopBar', () => {
  it('should render Hallo', () => {
    const wrapper = shallow(<TopBar />)

    expect(wrapper.text()).toContain('My account')
  })
})
