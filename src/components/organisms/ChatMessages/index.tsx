import React from 'react'
import { useHistory } from 'react-router'
import { observer } from 'mobx-react-lite'
import cn from 'classnames'

import ChatInput from '../ChatInput'
import MessageList from '../../molecules/MessageList'
import InputWithSvgIcon from '../../molecules/InputWithSvgIcon'
import FriendIcon from '../../molecules/FriendIcon'
import EmptyContentPopup from '../../atoms/EmptyContentPopup'

import { IFriends } from '../../../interface/friends'

import { ReactComponent as BackArrow } from '../../../assets/images/arrow.svg'

import './styles.scss'

import chat from '../../../store/chat'

const ChatMessages: React.FC = () => {
  const history = useHistory()

  if (!chat.selectedFriend) {
    return <EmptyContentPopup>Select a chat to start messaging</EmptyContentPopup>
  }

  const { name: friendName, gender, lastTimeOnline } = chat.selectedFriend as IFriends

  return (
    <>
      <div className="chat-header">
        <div
          className={cn('chat-header__backwards-arrow', {
            'chat-header__backwards-arrow_hidden_desktop': chat.selectedFriend
          })}
        >
          <InputWithSvgIcon
            id="backwards"
            type="button"
            onClickHandler={() => {
              history.push('/messages/')
            }}
          >
            <BackArrow />
          </InputWithSvgIcon>
        </div>
        <div
          className={cn('chat-header__user-icon', {
            'chat-header__user-icon_hidden_desktop': chat.selectedFriend
          })}
        >
          <FriendIcon icon={gender} isHeader />
        </div>
        <div className="chat-header__info">
          <div className="chat-header__name">{friendName}</div>
          <div className="chat-header__last-time">
            {lastTimeOnline?.toLowerCase() !== 'online' ? `Last seen ${lastTimeOnline} ago` : 'Online'}
          </div>
        </div>
      </div>
      <div className="chat-messages">
        <MessageList />
      </div>
      <div className="chat-input-container">
        <ChatInput />
      </div>
    </>
  )
}

export default observer(ChatMessages)
