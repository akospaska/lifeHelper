Endpoints:

Auth

    - api/auth/login
      Method:Post
      Example:{"email":"akospaska@gmail.com","password":"pacal"}

    - api/auth/me
      Method:Get

    - api/auth/register
      Method:Post
      Example:{"emailAddress":"brutalbracsa@gmail.com","password":"pacal","passwordAgain":"pacal","creatorAccountId":0,"isAdmin":false}

    - api/auth/registerconfirmation?token=randomHashValue
      Method:Get

    - api/auth/changepasswordafterforgotpasswordrequest
      Method:Post
      Example:{"emailAddress":"akospaska@gmail.com","password":"pacal","forgotPasswordToken":"randomhashToken"}

    - api/auth/forgotpasswordrequest
      Method:Post
      Example: {email: "brutalbracsa@gmail.com"}

Grocery

    Category:

    - api/grocery/category/createcategory
      Method:Post
      Example:{ "accountId": 1, "groupId": 1, "priority": 3, "icon": "icon", "newCategoryName": "new category name" }

    - api/grocery/category/deletecategory
      Method:Post
      Example:{"categoryId":13}

    - api/grocery/category/getcategories
      Method:Post
      Example:{"accountId":1,"groupId":1 }

    - api/grocery/category/getcategorieswithitems
      Method:Post
      Example:{"groupId":1}

    - api/grocery/category/modifycategory
      Method:Post
      Example:{"categoryId": 2,"categoryDetails": {"categoryName": "new modified category name": 3,"icon":"asdasd"}}

    GroceryItem:

    - api/grocery/groceryitem/creategroceryitem
      Method:Post
      Example:{"accountId":1,"groupId":1,"categoryId":2,"groceryItemName":"I through super hupper gateway"}

    - api/grocery/groceryitem/deletegroceryitem
      Method:Post
      Example:{"groceryItemId":5}

    Group:

    - api/grocery/group/creategroup
      Method:Post
      Example:{"newGroupName":"I am the new group name}

    - api/grocery/group/getgroups
      Method:Get

    - api/grocery/group/deletegroup
      Method:Post
      Example:{"groupId":7}
