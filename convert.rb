require 'json'
require 'csv'

puts "Converting"

data_points = []

File.open("input/original.txt").each_line { |line|
  data = JSON.parse(line)
  if data["category"] == "tracker"
    point = []
    point << data["values"]["frame"]["time"]
    point << data["values"]["frame"]["avg"]["x"]
    point << data["values"]["frame"]["avg"]["y"]
    point << data["values"]["frame"]["lefteye"]["psize"]
    data_points << point
  end
  
}

CSV.open("data_points.csv", 'w') do |writer|
  writer << ['timestamp', 'x', 'y', 'psize']
  data_points.each {|point|
    writer << point
  }
end

puts data_points.map{|p| p[3]}.minmax
