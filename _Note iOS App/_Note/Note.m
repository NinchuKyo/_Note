//
//  Note.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "Note.h"

@implementation Note

+ (Note *) noteTitle:(NSString *) title noteWithText:(NSString *)text{
    
    Note* note = [Note new];
    NSAttributedString *temp = [self formatHTMLString:text];
    
    note.titleString = title;
    note.contents = text;
    note.htmlContentsAsString = [self formatAttributedStringToHTMLString:temp];
    note.htmlContents = [self formatHTMLString:note.htmlContentsAsString];
    note.timestamp = [NSDate date];
    return note;
}

- (NSString *) title {
    return self.titleString;
}

+ (NSAttributedString *) formatHTMLString: (NSString *) htmlString {
    
    NSAttributedString *stringWithHTMLAttributes = nil;
    if (htmlString != nil)
    {
        NSData *data = [htmlString dataUsingEncoding:NSUTF8StringEncoding];
        stringWithHTMLAttributes = [[NSAttributedString alloc] initWithData:data options:@{NSDocumentTypeDocumentAttribute:NSHTMLTextDocumentType} documentAttributes:nil error:nil];
    }
    
    return stringWithHTMLAttributes;
}

+ (NSString *) formatAttributedStringToHTMLString: (NSAttributedString *) htmlAttributedString {
    NSDictionary *exportParams = @{NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType};
    NSData *htmlData = [htmlAttributedString dataFromRange:NSMakeRange(0, htmlAttributedString.length) documentAttributes:exportParams error:nil];
    return [[NSString alloc] initWithData:htmlData encoding:NSUTF8StringEncoding];
}


@end
