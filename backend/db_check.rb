# scratch script to check db status
articles = Article.all
puts "=== ARTICLES ==="
articles.each do |a|
  puts "ID: #{a.id} | Title: #{a.title[0..40]}... | Status: #{a.status} | Review Assignments count: #{a.review_assignments.count}"
  a.review_assignments.each do |ra|
    puts "  - Reviewer: #{ra.user.first_name} #{ra.user.last_name} | Status: #{ra.status} | Recommendation: #{ra.recommendation}"
  end
end
