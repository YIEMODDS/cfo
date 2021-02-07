import Quotation from "../../../src/models/Quotation"

describe('Qutation', () => {
  let quotation
  beforeEach(() =>{
    let json = {
      quotationNumber: "202001-001",
      quotationDate: "2020-01-03",
      projectName: "React",
      targetCompany: {
        name: "Facebook HQ",
      },
    }
    quotation = new Quotation(json)
  })

  describe('parsing json data', () => {
    it('should have quotation number', () => {
      expect(quotation.quotationNumber).toEqual('202001-001')
    })

    it('should have duplicattion url', () => {
      expect(quotation.duplicationUrl()).toEqual('/quotation/202001-001/duplicate')
    })
  })

  describe('Printing', () => {
    it('should have original', () => {
      let titles = quotation.getTitles();
      expect(titles[0].title).toEqual('Quotation (original)')
    })
    it('should have copy', () => {
      let titles = quotation.getTitles();
      expect(titles[1].title).toEqual('Quotation (copy)')
    })
    it('should have filename to be save when export to PDF and store in storage', () => {
      expect(quotation.filename()).toEqual('001-012020_QUOTATION_Facebook HQ_React')
    })
  })

  describe('list quotation', () => {
    it('should have number expeced by presenter', () => {
      expect(quotation.number).toEqual('202001-001')
    })
    it('should have date expeced by presenter', () => {
      expect(quotation.date).toEqual('2020-01-03')
    })
  })

  describe('Update duplicated quotation', () => {
    it('should be able to set quotation date to today', () => {
      let today = new Date("January 13, 2021")
      quotation.quotationDate = '2021-01-02'
      quotation.setDateToday(today)
      expect(quotation.quotationDate).toEqual('2021-01-13')
    })
  })

  describe("delete quotation", () => {
    it('should update quotation number so the quotation number can be reused while unique', () => {
      let t = '1610194022999'
      mockCurrentTimestamp(quotation, t)

      quotation.markAsDeleted()

      expect(quotation.quotationNumber).toEqual(`202001-001-cancelled-${t}`)
    })
  })
})
function mockCurrentTimestamp(quotation, timestamp) {
  jest.spyOn(quotation, 'currentTimestamp').mockReturnValue(timestamp)
}