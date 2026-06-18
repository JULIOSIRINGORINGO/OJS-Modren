require "test_helper"

class ArticlesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @author = users(:author_user)
    @editor = users(:editor_user)
    @admin = users(:admin_user)
    @category = categories(:one)
    @article = articles(:one)
  end

  test "should create article and send welcome notification to author" do
    # Encode author user_id in Base64 for Authorization header
    token = Base64.strict_encode64(@author.id.to_s)
    
    assert_difference("Article.count", 1) do
      assert_difference("Message.count", 1) do
        post api_articles_url,
             params: {
               title: "New Testing Article",
               abstract: "This is a new test abstract",
               authors: "Andi Prasetyo, Budi Utomo",
               category_id: @category.id
             },
             headers: { "Authorization" => "Bearer #{token}" },
             as: :json
      end
    end

    assert_response :created
    welcome_msg = Message.last
    assert_equal @author.id, welcome_msg.receiver_id
    assert_match /Naskah Berhasil Dikirim/, welcome_msg.subject
  end

  test "should update status as editor and send notification to author" do
    token = Base64.strict_encode64(@editor.id.to_s)

    # Initial status is Under Review
    assert_equal "Under Review", @article.status

    assert_difference("Message.count", 1) do
      patch api_article_url(@article),
            params: {
              status: "Revision Required",
              notes: "Please refine the conclusion and reference formatting."
            },
            headers: { "Authorization" => "Bearer #{token}" },
            as: :json
    end

    assert_response :success
    @article.reload
    assert_equal "Revision Required", @article.status

    notification = Message.last
    assert_equal @editor.id, notification.sender_id
    assert_equal @author.id, notification.receiver_id
    assert_match /Pembaruan Status Naskah/, notification.subject
    assert_match /Please refine the conclusion/, notification.body
  end

  test "should update status as admin and send notification to author" do
    token = Base64.strict_encode64(@admin.id.to_s)

    # Initial status is Under Review
    assert_equal "Under Review", @article.status

    assert_difference("Message.count", 1) do
      patch api_article_url(@article),
            params: {
              status: "Published",
              notes: "Congratulations! Your article has been accepted and published."
            },
            headers: { "Authorization" => "Bearer #{token}" },
            as: :json
    end

    assert_response :success
    @article.reload
    assert_equal "Published", @article.status

    notification = Message.last
    assert_equal @admin.id, notification.sender_id
    assert_equal @author.id, notification.receiver_id
    assert_match /Pembaruan Status Naskah/, notification.subject
    assert_match /Congratulations! Your article has been accepted/, notification.body
  end

  test "should automatically reset status to Under Review and notify both editor and author when author submits a revision" do
    # Set initial status of the article to Revision Required
    @article.update_columns(status: "Revision Required")
    
    token = Base64.strict_encode64(@author.id.to_s)

    # Author submits revision (files and notes)
    # This should generate 2 messages: 1 to editor, 1 to author
    assert_difference("Message.count", 2) do
      patch api_article_url(@article),
            params: {
              revision_notes: "Perbaikan format tabel dan sitasi.",
              revised_file_name: "revisi_andi_final.docx"
            },
            headers: { "Authorization" => "Bearer #{token}" },
            as: :json
    end
    assert_response :success
    @article.reload
    assert_equal "Under Review", @article.status
    assert_equal 2, @article.round

    # Last message is to author
    receipt = Message.last
    assert_equal @author.id, receipt.receiver_id
    assert_match /Revisi Naskah Diterima/, receipt.subject
    assert_match /Perbaikan format tabel/, receipt.body

    # Second to last is to editor
    notification = Message.order(created_at: :asc).last(2).first
    assert_equal @editor.id, notification.receiver_id
    assert_match /Revisi Masuk/, notification.subject
    assert_match /revisi_andi_final.docx/, notification.body
  end

  test "should allow show of unpublished article to its author" do
    token = Base64.strict_encode64(@author.id.to_s)
    get api_article_url(@article),
        headers: { "Authorization" => "Bearer #{token}" },
        as: :json
    assert_response :success
  end

  test "should allow show of unpublished article to editor" do
    token = Base64.strict_encode64(@editor.id.to_s)
    get api_article_url(@article),
        headers: { "Authorization" => "Bearer #{token}" },
        as: :json
    assert_response :success
  end

  test "should deny show of unpublished article to guest" do
    get api_article_url(@article),
        as: :json
    assert_response :unauthorized
  end

  test "should deny show of unpublished article to unauthorized author" do
    another = User.create!(first_name: "Budi", last_name: "Santoso", email: "budi@gmail.com", password: "password123", role: "author")
    token = Base64.strict_encode64(another.id.to_s)
    get api_article_url(@article),
        headers: { "Authorization" => "Bearer #{token}" },
        as: :json
    assert_response :forbidden
  end
end
