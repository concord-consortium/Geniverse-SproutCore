def bog(str)
  (str || "").gsub(/(alleles:\s?'[^']*?)(,a:Bog,b:Bog)?'/) {|m| "#{$1},a:Bog,b:Bog'" }
end

def boghide(str)
  (str || "").gsub(/('(?:all|male|female)':\s?'[^']*?)(,bog)?'/) {|m| "#{$1},bog'" }
end

Activity.all.each do |a|
  a.initial_alleles = bog(a.initial_alleles)
  a.match_dragon_alleles = bog(a.match_dragon_alleles)
  a.hidden_genes = boghide(a.hidden_genes)
  a.save
end
