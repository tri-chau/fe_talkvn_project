import {
  CommentDTO,
  ImageDTO,
  PostDetailDTO,
  PostDTO,
  UserDTO,
} from "../../types/data.type";
import { UserRES } from "../../types/users.type";
import {
  CommentRES,
  GetListPostRES,
  GetPostDetailRES,
  PostMediaRES,
} from "./post.response";

export const getUserDTO = (data: UserRES): UserDTO => ({
  id: data.id || "",
  userDisplayName: data.displayName,
  username: data.displayName,
  profileImage: {
    key: data.avatarUrl,
    url: data.avatarUrl,
  },
});

export const getPostDTO = (data: GetListPostRES): PostDTO => ({
  id: data.id,
  postAt: data.createdOn * 1000,
  postUser: getUserDTO(data.userPosted),
  postImages: data.postMedias.map((media) => ({
    key: media.id,
    url: media.mediaUrl,
  })),
  likeCount: data.reactionCount,
  caption: data.description,
  commentCount: data.commentCount,
  isLiked: data.isReacted,
});

export const getImageDTO = (data: PostMediaRES): ImageDTO => ({
  key: data.id,
  url: data.mediaUrl,
});

export const getCommentDTO = (data: CommentRES): CommentDTO => ({
  id: data.id,
  comment: data.content,
  commentAt: data.createdOn * 1000,
  commentUser: getUserDTO(data.userPosted),
});

export const getPostDetailDTO = (data: GetPostDetailRES): PostDetailDTO => ({
  post: {
    id: data.id,
    postAt: data.createdOn * 1000,
    postUser: getUserDTO(data.userPosted),
    postImages: data.postMedias.map((postImage) => getImageDTO(postImage)),
    likeCount: data.reactionCount,
    caption: data.description,
    commentCount: data.commentCount,
    isLiked: data.isReacted,
  },
  comments: data.comments.map((comment) => getCommentDTO(comment)),
});
