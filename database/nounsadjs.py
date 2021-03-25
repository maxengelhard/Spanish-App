from selenium import webdriver
import time
import psycopg2

# Connect to your postgres DB
conn = psycopg2.connect("dbname=fluency user=maxengelhard")

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a query
def adjectives():
    cur.execute("SELECT * FROM adjectivesspanish WHERE completed ISNULL ORDER BY aid;")
# Retrieve query results
# open up driver
    url ='https://www.spanishdict.com/translate/'

    driver = webdriver.Chrome('/opt/homebrew/bin/chromedriver')
    records = cur.fetchall()
    for record in records:
        aid = record[0]
        word = record[1]
        # word_id = record[2]
        words = getWords(driver,url+word,'Adjective')
        if len(words) ==2:
            sm = words[0].word
            pm = words[1].word
            cur.execute("UPDATE adjectivesspanish SET sm=%s,pm=%s,completed=1 WHERE aid=%s",(sm,pm,aid))
            conn.commit()
            print(word)
        elif len(words) ==4:
            sm = words[0].word
            sf = words[1].word
            pm = words[2].word
            pf = words[3].word
            cur.execute("UPDATE adjectivesspanish SET sm=%s,sf=%s,pm=%s,pf=%s,completed=1 WHERE aid=%s",(sm,sf,pm,pf,aid))
            conn.commit()
            print(word)
        else:
            cur.execute("UPDATE adjectivesspanish SET completed=1 WHERE aid=%s",(aid,))
            conn.commit() 
            print(word)
    time.sleep(1)
    driver.close()
    driver.quit()
        
        
        # return records

def nouns():
    cur.execute("SELECT * FROM nounsspanish WHERE completed ISNULL ORDER BY nid")
# Retrieve query results
# open up the url
    url ='https://www.spanishdict.com/translate/'

    driver = webdriver.Chrome('/opt/homebrew/bin/chromedriver')

# loop over query results
    records = cur.fetchall()
    for record in records:
        nid = record[0]
        word = record[1]

        words = getWords(driver,url+word,'Noun')
        # check to see how long it is
        if len(words) ==2:
            sm = words[0].word
            pm = words[1].word
            cur.execute("UPDATE nounsspanish SET sm=%s,pm=%s,completed=1 WHERE nid=%s",(sm,pm,nid))
            conn.commit()
            print(word)
        elif len(words) ==4:
            sm = words[0].word
            sf = words[1].word
            pm = words[2].word
            pf = words[3].word
            cur.execute("UPDATE nounsspanish SET sm=%s,sf=%s,pm=%s,pf=%s,completed=1 WHERE nid=%s",(sm,sf,pm,pf,nid))
            conn.commit()
            print(word)
        else:
            cur.execute("UPDATE nounsspanish SET completed=1 WHERE nid=%s",(nid,))
            conn.commit() 
            print(word)
    time.sleep(1)
    driver.close()
    driver.quit()




def getWords(driver,url,sqlgrammar):

    driver.get(url)
    values = []
    class WordDescription:
        def __init__(self,grammar,title,word):
            self.grammar = grammar
            self.title = title
            self.word = word
    wordForms = driver.find_element_by_xpath('//*[@id="inflections-card"]/div[1]')
    wordForms.location_once_scrolled_into_view
    time.sleep(2)
    grammars = driver.find_elements_by_class_name('_2FFcFgTf')
    lists = driver.find_elements_by_class_name('_3-5VzPZj')
    for indx, elements in enumerate(lists):
        if len(grammars) >0:
            grammar = grammars[indx].text
        else:
            grammar=sqlgrammar
        if grammar==sqlgrammar:
            wordElements = elements.find_elements_by_class_name('_2lTxL6x2')
            for element in wordElements:
                title = element.find_element_by_css_selector('a').text
                word = element.find_element_by_class_name('_15emggX8').text
                splitUp = word.split()
                if len(splitUp)>1:
                    word = splitUp[1]
                w = [WordDescription(grammar,title,word)]
                values.extend(w)
    return values


def callFunctions():
    adjectives()

callFunctions()