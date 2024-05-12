import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { HiOutlinePlus } from "react-icons/hi";
import { PiPaperPlaneRightFill, PiSquaresFour } from "react-icons/pi";
import { SlEmotsmile } from "react-icons/sl";
import { IoIosCamera } from "react-icons/io";
import { HiSpeakerphone } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import TextField from '@mui/material/TextField';
import { EMOJI } from "@constants/index";
import { EmojiItem, ChatSendMessage } from "@type/index";
import { uploadFileApi } from "@api/file";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";

interface ChatInputProps {
  onSendMessage: (newMessages: ChatSendMessage) => void;
}

const ChatInput = (props: ChatInputProps) => {
  const { onSendMessage } = props;
  const [inputMessage, setInputMessage] = useState<string>("");
  const [inputFile, setInputFile] = useState<File[] | null>(null);
  const [inputEmoji, setInputEmoji] = useState<EmojiItem | null>(null);
  const [isOpenPlus, setIsOpenPlus] = useState<boolean>(false);
  const [isOpenAppointment, setIsOpenAppointment] = useState<boolean>(false);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>("");
  const [isOpenFilePreview, setIsOpenFilePreview] = useState<boolean>(false);
  const [isOpenEmojiPreview, setIsOpenEmojiPreview] = useState<boolean>(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEmojiCategory, SetSelectedEmojiCategory] = useState<string>(EMOJI[0].name);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 변수 초기화
  const reset = () => {
    setIsOpenPlus(false);
    setIsOpenAppointment(false);
    setIsOpenFilePreview(false);
    setIsOpenEmojiPreview(false);
    setIsOpenEmoji(false);
    setInputMessage("");
    setInputFile(null);
    setInputEmoji(null);
  }

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    const currentTime: string = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // FILE
    if (inputFile) {
      const files: string[] = [];

      inputFile.forEach((file: File) => {
        // FormData 객체 생성
        const formData = new FormData();
        formData.append("fileType", "MESSAGE");
        formData.append('file', file);

        // 파일 업로드
        uploadFileApi(
          formData,
          (res) => {
            files.push(res.data.imageUrl);
          },
          (error) => {
            console.error(error)
          })
          .then().catch();
      });

      onSendMessage({
        messageType: "FILE",
        files,
        currentTime,
      })
    }

    // 메시지 전송
    if (inputMessage) {
      // APPOINTMENT
      if (isOpenAppointment) {
        onSendMessage({
          messageType: "APPOINTMENT",
          content: inputMessage,
          currentTime,
        })
      }
      // EMOJI
      else if (inputEmoji) {
        onSendMessage({
          messageType: "EMOJI",
          content: inputMessage,
          emojiId: inputEmoji.id,
          currentTime,
        })
      }
      // MESSAGE
      else {
        onSendMessage({
          messageType: "MESSAGE",
          content: inputMessage,
          currentTime,
        })
      }
    }
    reset();
  }

  // 메시지 입력 핸들러
  const handleSetMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  }

  // 약속 버튼 클릭 핸들러
  const handleAppointmentClick = () => {
    setIsOpenAppointment(true);
  }

  // 카메라 버튼 클릭 핸들러
  const handleCameraClick = () => {
    // 파일 선택 대화 상자 열기
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // 파일 선택 핸들러
  const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setInputFile(Array.from(event.target.files))
      // 미리보기 렌더링
      setIsOpenFilePreview(true);

      // 이모티콘 입력 초기화
      setInputEmoji(null);
      setIsOpenEmojiPreview(false);
    }
  }

  // 미리보기 이미지 삭제 핸들러
  const handlePreviewImageDeleteClick = (index: number) => {
    if (inputFile) {
      const newFiles = [...inputFile];
      newFiles.splice(index, 1);
      setInputFile(newFiles);
    }
  }

  // 파일리스트가 빌 경우 미리보기 닫음
  useEffect(() => {
    if (!inputFile || inputFile.length === 0) {
      setIsOpenFilePreview(false);
    } else {
      setIsOpenPlus(false);
    }
  }, [inputFile]);

  // 이모티콘 선택 핸들러
  const handleSetEmoji = (emoji: EmojiItem) => {
    setInputEmoji(emoji);

    // 미리보기 렌더링
    setIsOpenEmojiPreview(true);

    // 파일 입력 초기화
    setInputFile(null);
    setIsOpenFilePreview(false);
  }

  // 이모티콘 미리보기 닫기 핸들러
  const handleClosePreviewClick = () => {
    setIsOpenEmojiPreview(false);
    setInputEmoji(null);
  }

  // input 토글
  useEffect(() => {
    setInputMessage("");
    setInputFile(null);
    setIsOpenEmoji(false);
    setInputEmoji(null);
    setIsOpenEmojiPreview(false);

    if (isOpenAppointment) {
      setInputPlaceholder("가벼운 약속을 잡아 보세요");
    } else {
      setInputPlaceholder("메시지를 전달해 보세요");
    }
  }, [isOpenAppointment]);

  // 좌측 하단 버튼 외부 요소 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonWrapperRef.current && !buttonWrapperRef.current.contains(event.target as Node)) {
        setIsOpenPlus(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // 언마운트 시 이벤트리스너 해제
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Input 포커스 감지
  useEffect(() => {
    const handleFocus = () => {
      console.log('Input에 포커스가 맞춰졌습니다.');
    };

    const handleBlur = () => {
      console.log('Input에서 포커스가 해제되었습니다.');
    };

    // inputRef.current가 존재할 때만 이벤트 리스너를 추가합니다.
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
    }

    // 컴포넌트가 unmount 될 때 이벤트 리스너를 제거합니다.
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  // 미리보기 조건부 렌더링
  const renderPreview = () => {
    return (
      <div className="chat-input__preview__container">
        {/*파일 미리보기*/}
        {isOpenFilePreview && (
          <div className="chat-input__preview__file-list">
            {inputFile && inputFile.map((file: File, index: number) => (
              <div className="chat-input__preview__file-item" key={index}>
                {/*이미지*/}
                <img src={URL.createObjectURL(file)} alt={file.name}/>

                {/*삭제 버튼*/}
                <button className="chat-input__preview__button" onClick={() => handlePreviewImageDeleteClick(index)}>
                  <IoCloseOutline size={20}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/*이모티콘 미리보기*/}
        {isOpenEmojiPreview && inputEmoji && (
          <div className="chat-input__preview__emoji">
            <img key={inputEmoji.id} src={inputEmoji.image} alt={inputEmoji.id}/>
          </div>
        )}

        {/*닫기 버튼*/}
        {isOpenEmojiPreview && (
          <button className="chat-input__preview__button" onClick={handleClosePreviewClick}>
            <IoCloseOutline size={20}/>
          </button>
        )}
      </div>
    )
  }

  // mui custom
  const muiFocusCustom = {
    '& label.Mui-focused': {
      color: '#00ff0000',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00ff0000',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#00ff0000',
      },
      '&:hover fieldset': {
        borderColor: '#00ff0000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00ff0000',
      },
    },
  }

  return (
    <div className="chat-input">
      <div className="chat-input__main">
        <div className={`chat-input__button-wrapper${isOpenAppointment ? "--disabled" : ""}`} ref={buttonWrapperRef}>
          {/*플러스 버튼 - 클릭 시 카메라 및 약속 버튼 렌더링*/}
          <button
            className={`chat-input__button-plus${isOpenPlus ? "--active" : ""}`}
            onClick={() => setIsOpenPlus(!isOpenPlus)}
          >
            <HiOutlinePlus size={24}/>
          </button>

          {/*약속 메시지 버튼*/}
          <button
            className={`chat-input__button-appointment${isOpenPlus ? "--active" : ""}`}
            onClick={handleAppointmentClick}
          >
            <HiSpeakerphone size={20}/>
          </button>

          {/*사진 전송 버튼*/}
          <button
            className={`chat-input__button-camera${isOpenPlus ? "--active" : ""}`}
            onClick={handleCameraClick}
          >
            <IoIosCamera size={24}/>
          </button>

          {/*앨범 버튼*/}
          <NavLink
            to="/chatting/photo"
            className={`chat-input__button-album${isOpenPlus ? "--active" : ""}`}
          >
            <PiSquaresFour size={24}/>
          </NavLink>

          {/* 파일 선택 */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{display: 'none'}}
            onChange={handleSetFile}
            multiple
          />
        </div>

        <div className="chat-input__field">
          {/*입력창*/}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={handleSetMessage}
            placeholder={inputPlaceholder}
            inputProps={isOpenAppointment ? {maxLength: 20} : {maxLength: 1000}}
            sx={muiFocusCustom}
            size="small"
            className="chat-input__input"
            ref={inputRef}
          />

          {isOpenAppointment ? (
            // 약속 잡기 취소 버튼
            <button className="chat-input__button-cancel" onClick={reset}>
              <IoCloseCircleOutline size={30}/>
            </button>
          ) : (
            // 이모티콘 버튼
            <button
              className={`chat-input__button-emoji${isOpenEmoji ? "--active" : ""}`}
              onClick={() => setIsOpenEmoji(!isOpenEmoji)}
            >
              <SlEmotsmile size={24}/>
            </button>
          )}

          {/*전송 버튼*/}
          <button
            className={`chat-input__button-send${isOpenAppointment ? "--appointment" : ""}`}
            onClick={handleSendMessage}
          >
            {isOpenAppointment ? <HiSpeakerphone size={20}/> : <PiPaperPlaneRightFill size={20}/>}
          </button>
        </div>

        {/*미리보기 창*/}
        {(isOpenFilePreview || isOpenEmojiPreview) && (
          <div className="chat-input__preview">
            {renderPreview()}
          </div>
        )}
      </div>

      {/*이모티콘*/}
      {isOpenEmoji && (
        <div className="chat-input__emoji">
          <div className="chat-input__emoji-tabs">
            {EMOJI.map((category, index: number) => (
              <div
                key={category.name}
                className={`chat-input__emoji-tab${selectedEmojiCategory === category.name ? '--active' : ''}`}
                onClick={() => SetSelectedEmojiCategory(category.name)}>
                <div className="chat-input__emoji-tab-icon">
                  <img src={category.image} alt=""/>
                </div>
              </div>
            ))}
          </div>

          {EMOJI.map((category, index: number) => (
            <div
              key={category.name} // 여기에서도 category.name을 고유한 키로 사용합니다.
              className={`chat-input__emoji-items${category.name === selectedEmojiCategory ? '--active' : ''}`}>
              {category.item.map((emoji, index: number) => (
                <div key={emoji.id} className="chat-input__emoji-item" onClick={() => handleSetEmoji(emoji)}>
                  <img src={emoji.image} alt={emoji.id}/>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default ChatInput;
