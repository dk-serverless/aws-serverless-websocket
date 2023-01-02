get-todolist:
	curl -X GET https://mz1z5dx37l.execute-api.ap-northeast-2.amazonaws.com/dev/todolist

get-todolist-id:
	curl -X GET https://mz1z5dx37l.execute-api.ap-northeast-2.amazonaws.com/dev/todolist?id=1

post-todolist:
	curl -X POST https://mz1z5dx37l.execute-api.ap-northeast-2.amazonaws.com/dev/todolist \
	-d "{"title" : "title", "desc" : "desc" , "created_at": 1000}"

del-todolist-id:
	curl -X DELETE https://mz1z5dx37l.execute-api.ap-northeast-2.amazonaws.com/dev/todolist?id=1

