//
//  Note.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "Note.h"

@implementation Note {
    NSString *titleString;
    NSString *contents;
    NSAttributedString *htmlContents;
    NSString *htmlContentsAsString;
    NSDate *timestamp;
}


+ (Note *) noteTitle:(NSString *) title noteWithText:(NSString *)text
{
    
    Note* note = [Note new];
    note->titleString = title;
    note->contents = text;
    
    [self setEmptyIfNil: note];
    [self replaceInvalidCharactersInTitle: note];
    NSAttributedString *temp = [self formatHTMLString:note->contents];
    
    note->htmlContentsAsString = [self formatAttributedStringToHTMLString:temp];
    note->htmlContents = [self formatHTMLString:note->htmlContentsAsString];
    note->timestamp = [NSDate date];
    
    return note;
}

// Accessor methods
- (NSString *) title
{
    return self->titleString;
}

- (NSString *) contents
{
    return self->contents;
}

- (NSAttributedString *) htmlContents
{
    return self->htmlContents;
}

// Mutator methods
- (void) setTitle: (NSString *) newTitle
{
    self->titleString = newTitle;
    [Note setEmptyIfNil:self];
    [Note replaceInvalidCharactersInTitle:self];
}

- (void) setContents: (NSString *) newContent
{
    // This method is for plain-text notes
    self->contents = newContent;
    NSAttributedString *temp = [Note formatHTMLString:newContent];
    self->htmlContentsAsString = [Note formatAttributedStringToHTMLString:temp];
    self->htmlContents = [Note formatHTMLString:self->htmlContentsAsString];
}

- (void) setHTMLContents: (NSAttributedString *) newHTMLContents
{
    // Method for rich-text notes
    self->htmlContents = newHTMLContents;
    self->htmlContentsAsString = [Note formatAttributedStringToHTMLString:newHTMLContents];
}

// Formatting methods
+ (void) setEmptyIfNil: (Note *) note
{
    if (note->titleString == nil)
    {
        note->titleString = @"";
    }
    
    if (note->contents == nil)
    {
        note->contents = @"";
    }
}

+ (void) replaceInvalidCharactersInTitle: (Note *) note
{
    NSString *pattern = @"[^a-zA-Z0-9\\_\\-]*";
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern options:NSRegularExpressionCaseInsensitive error:nil];
    NSString *newString = [regex stringByReplacingMatchesInString:note->titleString options:0 range:NSMakeRange(0, [note->titleString length]) withTemplate:@""];
    note->titleString = newString;
}

+ (NSAttributedString *) formatHTMLString: (NSString *) htmlString
{
    
    NSAttributedString *stringWithHTMLAttributes = nil;
    NSString *inputString = htmlString;
    
    if (inputString == nil)
    {
        inputString = @"";
    }
    
    NSData *data = [inputString dataUsingEncoding:NSUTF8StringEncoding];
    stringWithHTMLAttributes = [[NSAttributedString alloc] initWithData:data options:@{NSDocumentTypeDocumentAttribute:NSHTMLTextDocumentType} documentAttributes:nil error:nil];
    
    return stringWithHTMLAttributes;
}

+ (NSString *) formatAttributedStringToHTMLString: (NSAttributedString *) htmlAttributedString
{
    
    NSAttributedString *newAttributedString = htmlAttributedString;
    
    if (newAttributedString == nil)
    {
        newAttributedString = [Note formatHTMLString:@"Content"];
    }
    
    NSDictionary *exportParams = @{NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType};
    NSData *htmlData = [newAttributedString dataFromRange:NSMakeRange(0, newAttributedString.length) documentAttributes:exportParams error:nil];
    return [[NSString alloc] initWithData:htmlData encoding:NSUTF8StringEncoding];
}


@end
