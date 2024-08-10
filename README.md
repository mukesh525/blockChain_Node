

Socket Initialisation URL http://pro.people-app.org:4000

Story Comment socket emit object:

emitId: story_comment
data: {
  storyId:"5d0b13cacbbf52faaac6a5c8",
  userId:"5ccfdbe2ec73baa05f867ae8",
  comment:"hello test socket u"
}


Story like socket emit object:
emitId: story_like
data:{
   storyId:"5d0b13cacbbf52faaac6a5c8",
   userId:"5ccfdbe2ec73baa05f867ae8",
}


listner format for story like and  comment .
In every create story two socket listner will be added 
for example :
{
    "message": "Story Added successfully",
    "like_socket": "like_5d0b13cacbbf52faaac6a5c8",
    "comment_socket": "comment_5d0b13cacbbf52faaac6a5c8"
}

listner_format :
   comment_{storyId}
   like_{storyId}



sample emit
 {
  storyId:"5d0b12e37ef1fcf62eda196a",
  userId:"5ccfdbe2ec73baa05f867ae8",
  comment:"yup"
}

live
{
  storyId:"5d0b32ae36543268fbcff4d7",
  userId:"5ce047ba0373bd0843c2f391",
  comment:"yup"
}

