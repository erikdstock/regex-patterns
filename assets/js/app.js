function updateCountriesAndLabel() {
    const patternType = document.getElementById('patternType').value;
    const label = document.getElementById('secondSelectLabel');
    const countrySelect = document.getElementById('country');

    if (patternType === 'commonPatterns') {
        label.textContent = 'Select Dates, Currency or CreditCards:';
    } else {
        label.textContent = 'Select Country:';
    }

    if (patternType) {
        fetch('patterns.json')
            .then(response => response.json())
            .then(data => {
                let options = '<option value="">Please select</option>';
                const patterns = data.patterns[patternType];
                const items = Object.keys(patterns);
                items.forEach(item => {
                    options += `<option value="${item}">${item}</option>`;
                });
                countrySelect.innerHTML = options;
            })
            .catch(error => {
                console.error('Error fetching patterns:', error);
                countrySelect.innerHTML = '<option value="">Error loading options</option>';
            });
    } else {
        countrySelect.innerHTML = '<option value="">Please select pattern type first</option>';
    }
}

function showPattern() {
    const patternType = document.getElementById('patternType').value;
    const country = document.getElementById('country').value;
    const language = document.getElementById('programmingLanguage').value;
    if (!patternType || !country || !language) {
        document.getElementById('regexDisplay').textContent = 'Please select all fields.';
        document.getElementById('codeExampleDisplay').innerHTML = 'Please select all fields.';
        return;
    }

    fetch('patterns.json')
        .then(response => response.json())
        .then(data => {
            const regex = data.patterns[patternType][country] || 'No pattern available for this selection.';
            document.getElementById('regexDisplay').textContent = `Regex Pattern: ${regex}`;
            displayCodeExample(regex, language);
        })
        .catch(error => {
            document.getElementById('regexDisplay').textContent = 'Failed to load patterns.';
            console.error('Error loading the patterns:', error);
        });
}

function displayCodeExample(regex, language) {
    const codeExamples = {
        'PHP': `if (preg_match('/${regex}/', $input)) { echo 'Valid'; } else { echo 'Invalid'; }`,
        'JavaScript': `if (/${regex}/.test(input)) { console.log('Valid'); } else { console.log('Invalid'); }`,
        'Python': `import re\nif re.match(r'${regex}', input): print('Valid') else: print('Invalid')`,
        'C#': `using System.Text.RegularExpressions;\nif (Regex.IsMatch(input, @"${regex}")) { Console.WriteLine("Valid"); } else { Console.WriteLine("Invalid"); }`,
        'Java': `import java.util.regex.*;\nPattern pattern = Pattern.compile("${regex}");\nMatcher matcher = pattern.matcher(input);\nif (matcher.find()) { System.out.println("Valid"); } else { System.out.println("Invalid"); }`,
        'Ruby': `if /${regex}/.match(input) then puts 'Valid' else puts 'Invalid' end`,
        'Go': `import "regexp"\nmatched, _ := regexp.MatchString("${regex}", input)\nif matched { fmt.Println("Valid") } else { fmt.Println("Invalid") }`,
        'Swift': `import Foundation\nlet regex = try! NSRegularExpression(pattern: "${regex}")\nlet range = NSRange(location: 0, length: input.utf16.count)\nif regex.firstMatch(in: input, options: [], range: range) != nil { print("Valid") } else { print("Invalid") }`,
        'Perl': `if ($input =~ /${regex}/) { print "Valid"; } else { print "Invalid"; }`
    };
    document.getElementById('codeExampleDisplay').innerHTML = `<strong>Code Example in ${language}:</strong> ${codeExamples[language]}`;
}
