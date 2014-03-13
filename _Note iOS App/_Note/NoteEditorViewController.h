//
//  NoteEditorViewController.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <UIKit/UIKit.h>

@class Note;

@interface NoteEditorViewController : UIViewController <UISplitViewControllerDelegate>

@property (strong, nonatomic) IBOutlet UIWebView *web;
@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@property Note *note;
@property NSDictionary *json;

@end
