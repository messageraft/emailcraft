import React from 'react'
import { Button } from '@emailcraft/components'

interface SignupEmailTemplateProps {
  href: string
}

const SignupEmailTemplate: React.VFC<SignupEmailTemplateProps> = ({ href }) => {
  return (
    <div>
      <img
        src={`/static/airbnb-logo.png`}
        width="96"
        height="30"
        alt="Airbnb"
      />
      <Button href={href}>Signup</Button>
    </div>
  )
}

export default SignupEmailTemplate
