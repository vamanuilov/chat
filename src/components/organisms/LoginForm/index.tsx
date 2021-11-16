import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Controller, useForm, UseFormClearErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { loginSchema } from '../../../config/schemas'

import Button from '../../atoms/Button'
import FormInput from '../../molecules/FormInput'
import Captcha from '../CaptchaBlock'

import { ILoginData } from '../../../interface/user'

import user from '../../../store/user'
import popup from '../../../store/popup'

import './styles.scss'

import { LogInInputFields } from './common'

interface ILoginForm {
  onSubmitHandler: (data: ILoginData) => void
  onAdditionalButtonClickHandler: () => void
}

const LoginForm: React.FC<ILoginForm> = ({ onSubmitHandler, onAdditionalButtonClickHandler }) => {
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ILoginData>({ resolver: yupResolver(loginSchema) })

  useEffect(() => {
    user.resetErrors()
  }, [])

  useEffect(() => {
    switch (user.error.type) {
      case 'captcha': {
        setError('captcha', {
          type: 'manual',
          message: user.error.message
        })
        break
      }
      case 'userData': {
        ;['login', 'password'].forEach((inputName) => {
          setError(inputName as 'login' | 'password', {
            type: 'manual',
            message: user.error.message
          })
        })
        break
      }
      case 'general': {
        popup.setMessage({
          type: 'error',
          text: user.error.message
        })
        break
      }
    }
  }, [user.error])

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit(onSubmitHandler)}>
        {LogInInputFields.map(({ inputName, type, label, placeholder, id }) => (
          <div key={id} className="login-form__input">
            <Controller
              name={inputName}
              control={control}
              render={({ field: { onBlur, onChange, name, ref } }) => (
                <FormInput
                  type={type}
                  label={label}
                  placeholder={placeholder}
                  id={id}
                  errorText={errors[inputName]?.message}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange && onChange(e)
                    if (user.error.type === 'userData') {
                      user.resetErrors()
                      clearErrors(['login', 'password'])
                    }
                  }}
                  name={name}
                  innerRef={ref}
                />
              )}
            />
          </div>
        ))}
        <div className="login-form__captcha">
          <Controller
            name="captcha"
            control={control}
            render={({ field: { onBlur, onChange, name, ref } }) => (
              <Captcha
                resetError={clearErrors as UseFormClearErrors<Pick<ILoginData, 'captcha'>>}
                onBlur={onBlur}
                onChange={onChange}
                name={name}
                innerRef={ref}
                errorText={errors.captcha?.message}
              />
            )}
          />
        </div>
        <div className="form-buttons">
          <div className="login-form__button">
            <Button type="submit" buttonText="Log In" isMainButton isDisabled={user.isLoading || !isDirty} />
          </div>
          <div className="login-form__button">
            <Button type="button" buttonText="Sign Up" onClickHandler={onAdditionalButtonClickHandler} />
          </div>
        </div>
      </form>
    </>
  )
}

export default observer(LoginForm)
