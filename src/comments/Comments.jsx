import { useState, useEffect } from "react"
import { getComments as getCommentsApi, createComment as createCommentApi, deleteComment as deleteCommentApi, updateComment as updateCommentApi } from "../api"
import '../index.css'
import Comment from "./Comment"
import CommentForm from './CommentForm'

// eslint-disable-next-line react/prop-types
function Comments({ currentUserId }) {
    const [backendComments, setBackendComments] = useState([])
    const [activeComment, setActiveComment] = useState(null)

    const rootComments = backendComments.filter((backendComment) => backendComment.parentId === null)

    const getReplies = (commentId) => {
        return backendComments
            .filter((backendComment) => backendComment.parentId === commentId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    const addComment = (text, parentId) => {
        console.log('add comments', text, parentId)
        createCommentApi(text, parentId).then((comment) => {
            setBackendComments([comment, ...backendComments])
            setActiveComment(null)
        })
    }
    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure that you want to remove comment?")) {
            deleteCommentApi(commentId).then(() => {
                const updatedBackendComments = backendComments.filter(
                    (backendComments) => backendComments.id !== commentId
                )
                setBackendComments(updatedBackendComments)
            })
        }
    }

    const updateComment = (text, commentId) => {
        updateCommentApi(text, commentId).then(() => {
            const updatedBackendComments = backendComments.map((backendComment) => {
                if (backendComment.id === commentId) {
                    return { ...backendComment, body: text }
                }
                return backendComment
            })
            setBackendComments(updatedBackendComments)
        })
    }

    useEffect(() => {
        getCommentsApi().then((data) => {
            setBackendComments(data)
        })
    }, [])

    return (
        <div className="comments">
            <h3 className="comments-title">Comments</h3>
            <div className="comment-form-title">Write comment</div>
            <CommentForm submitLable="Write" handleSubmit={addComment} />
            <div className="comments-container">
                {rootComments.map((rootComment) => (
                    <Comment
                        key={rootComment.id}
                        comment={rootComment}
                        replies={getReplies(rootComment.id)}
                        currentUserId={currentUserId}
                        deleteComment={deleteComment}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        addComment={addComment}
                        updateComment={updateComment}
                    />
                ))}
            </div>
        </div>
    )
}

export default Comments