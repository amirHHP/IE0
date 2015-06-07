var offset = 1;
var post_id = null;
var temp_coms = new Array();
$(document).ready(function()
{
	getPostsList();
	$("#show-more-posts").click(function(){
		getPostsList();
	})


	$("body").on('click','.view-comments',function(){
		post_id = $(this).attr('id').substring(9,10);
		url = "http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Comments/"+post_id+".xml";
		var link = url;
		$.ajax({
			url: link, // name of file you want to parse
			dataType: "xml", // type of file you are trying to read
			success: show_more_comments, // name of the function to call upon success
			error: function(){alert("Error: Something went wrong");}
		});
	});
	$("body").on('click','.few-coms', function(){
		p_id = $(this).attr('id').substring(4,10);
		$("#cbox-"+p_id).html(temp_coms[p_id]);
	});
	$("body").on('click','.tag', function(){
		tag_val = $(this).html().substring(1,15);
		$(".post").hide();
		$("."+tag_val).show();
	});
});
function show_more_comments(document)
{
	$comments = $(document).find('comment');
	$cms_html = "";
	$comments.each(function(){
		$text = $(this).find('text:first').text();
		$cm_image = $(this).find('image:first').text();
		$date = $(this).find('date:first').text();
		$name = $(this).find('name:first').text();
		$cms_html += 
		"<ul class='post-old-comments'>"+
		"<li><img class='prof-pic' src='"+$cm_image+"' />"+
		"<div class='name-date'>"+
		"<div class='user-name'>"+$name+"</div>"+
		"<div class='date'>"+$date+"</div>"+
		"</div>"+
		"<div class='comment-fa'>"+$text+"</div>"+
		"</li>"+
		"</ul>";
	});
	$cms_html += "<center><button class='few-coms' id='fcm-"+post_id+"'>Show Fewer</button></center>";
	temp_coms[post_id] = $("#cbox-"+post_id).html();
	$("#cbox-"+post_id).html($cms_html);
}
function getPostsList()
{
	var url = "http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/IEPOSTS.xml";
	$.ajax({
    url: url, // name of file you want to parse
    dataType: "xml", // type of file you are trying to read
    success: parse_post_list, // name of the function to call upon success
    error: function(){alert("Error: can't getPostsList");}
});
}
function parse_post_list(document){
	$posts = $(document).find("post");
	posts_length = $posts.length;
	$posts.each(function(index,element){
		if( (index+1) >= offset && (index+1) <= (offset+10) )
		{
			var url = $(this).text();
			$.ajax({
			url: url, // name of file you want to parse
			dataType: "xml", // type of file you are trying to read
			success: parse_post, // name of the function to call upon success
			error: function(){alert("Error: can't parse_post_list");}
		});
		}
	});
	offset +=10;
	if(offset > posts_length)
		$("#show-more-posts").hide();
}
function parse_post(document)
{
	$hot = $(document).find('post').attr('hot');
	$author = $(document).find('author').text();
	$tags = $(document).find('tag').text();
	$tags_text = $tags.split("#");
	$date = $(document).find('date:first').text();
	$profile_pic = $(document).find('proofilepic').text();
	$image = $(document).find('image:first').text();
	$share = $(document).find('share').text();
	$text = $(document).find('text:first').text();
	$comments_num = $(document).find('comments').attr('commentNumber');
	$all_comments_link = $(document).find('comments').attr('allCommentsLink');
	//fetching post number
	$post_number = null;
	if($all_comments_link)
	{
		$x = $all_comments_link.split("/");
		$y = $x[7].split('.');
		$post_number = $y[0];
	}
	// end of fetching post number
	$like_number = $(document).find('like').attr('likeNumber');
	$likers = $(document).find('likers');
	$tags_html = "";
	for(i=0;i<$tags_text.length;i++)
	{
		if($tags_text[i])
			$tags_html += "<div class='tag'>#"+$tags_text[i]+"</div>"; 
	}
	if($hot == "no")
	{
		$post_html = ""+
		"<div class='post ";
		for(i = 0; i<$tags_text.length;i++)
		{
			if($tags_text[i])
				$post_html += $tags_text[i]+" ";
		}
		$post_html += "'>"+
		"<div class='post-body'>"+ 
		"<div class='post-publish-info'>"+
		"<img class='circle-pic prof-pic' src='"+$profile_pic+"' alt=''/>"+
		"<div class='name-date'>"+
		"<div class='user-name'>"+$author+"</div>"+
		"<div class='date'>"+$date+"</div>"+
		"</div>"+
		"<button class='add-friend'/>"+
		"</div>"+
		"<div class='post-content'>"+
		"<!-- image maybe placed here -->"+
		"<p class='post-content-text-fa' >"+$text+"</p>"+
		$tags_html+
		"</div>"+
		"<div class='post-like-area'>"+
		"<button class='post-like-counter'>"+$like_number+"</button>"+
		"<button class='post-share'>&nbsp;</button>"+
		"<div class='post-likers-photo' >";
		$likers = $(document).find('likers');
		$likers.each(function(){
			$l_name = $(this).find('name').text();
			$l_img = $(this).find('name').attr('image');
			$post_html += "<img src='"+$l_img+"' class='like-prof-pic' title='"+$l_name+"' />";
		})
		$post_html +=		
		"</div>"+
		"</div>"+
		"</div>";
		if($post_number)
			$post_html += "<div class='post-comment' id='cbox-"+$post_number+"'>";
		else
			$post_html += "<div class='post-comment'>";
		$comments = $(document).find('comment');
		$comments.each(function(){
			$text = $(this).find('text:first').text();
			$cm_image = $(this).find('image:first').text();
			$date = $(this).find('date:first').text();
			$name = $(this).find('name:first').text();
			$post_html += 
			"<ul class='post-old-comments'>"+
			"<li><img class='prof-pic' src='"+$cm_image+"' />"+
			"<div class='name-date'>"+
			"<div class='user-name'>"+$name+"</div>"+
			"<div class='date'>"+$date+"</div>"+
			"</div>"+
			"<div class='comment-fa'>"+$text+"</div>"+
			"</li>"+
			"</ul>";
		});
		$post_html += 
		"<div class='post-new-comment'>"+
		"<input type='text' >"+
		"</div>";
		if($post_number)
			$post_html += "<center><button class='view-comments' id='view-cms-"+$post_number+"'>View More Comment</button></center>";
		$post_html +=
		"</div>"+
		"</div>";
		$("#post-container").append($post_html);
	}
	else
	{
		$post_html = ""+
		"<div class='post column1 ";
		for(i = 0; i<$tags_text.length;i++)
		{
			if($tags_text[i])
				$post_html += $tags_text[i]+" ";
		}
		$post_html += "'>"
		+"<div class='post-body-major' >"
		+$tags_html
		+"<img src='"+$image+"' alt='' class='hot-topic' />"
		+"</div>"
		+"<div class='post-body-minor'>"
		+"<div class='post-body'>" 
		+"<div class='post-publish-info'>"
		+"<img class='circle-pic prof-pic' src='"+$profile_pic+"' alt=''/>"
		+"<div class='name-date'>"
		+"<div class='user-name'>"+$author+"</div>"
		+"<div class='date'>"+$date+"</div>"
		+"</div>"
		+"<button class='add-friend'/>"
		+"</div>"
		+"<div class='post-content'>"
		+"<!-- image maybe placed here -->"
		+"<p class='post-content-text-fa big-post-text' >"+$text+"</p>"
		+"</div>"
		+"</div>"
		+"<div class='post-comment-abs'>"
		+"<div class='post-like-area'>"
		+"<button class='post-like-counter'>"+$like_number+"</button>"
		+"<button class='post-share'>&nbsp;</button>"
		+"<div class='post-likers-photo' >";
		$likers = $(document).find('likers');
		$likers.each(function(){
			$l_name = $(this).find('name').text();
			$l_img = $(this).find('name').attr('image');
			$post_html += "<img src='"+$l_img+"' class='like-prof-pic' title='"+$l_name+"' />";
		})
		$post_html +=
		"</div>"
		+"</div>";
		if($post_number)
			$post_html += "<div class='post-background-gray' id='cbox-"+$post_number+"'>";
		else
			$post_html += "<div class='post-background-gray'>";
		$comments = $(document).find('comment');
		$comments.each(function(){
			$text = $(this).find('text:first').text();
			$cm_image = $(this).find('image:first').text();
			$date = $(this).find('date:first').text();
			$name = $(this).find('name:first').text();
			$post_html += 
			"<ul class='post-old-comments'>"+
			"<li><img class='prof-pic' src='"+$cm_image+"' />"+
			"<div class='name-date'>"+
			"<div class='user-name'>"+$name+"</div>"+
			"<div class='date'>"+$date+"</div>"+
			"</div>"+
			"<div class='comment-fa'>"+$text+"</div>"+
			"</li>"+
			"</ul>";
		});
		$post_html +=
		"<div class='post-new-comment'>"
		+"<input type='text' >"
		+"</div>";
		if($post_number)
			$post_html += "<center><button class='view-comments' id='view-cms-"+$post_number+"'>View More Comment</button></center>";
		$post_html += 
		"</div>"
		+"</div>"
		+"</div>"
		+"</div>"
		$("#post-container").append($post_html);
	}
}